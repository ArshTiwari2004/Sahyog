# ai-service/models/resource_optimization/allocation_model.py
import numpy as np
import pandas as pd
from ortools.linear_solver import pywraplp
from typing import Dict, List, Tuple
import json
from datetime import datetime

class ResourceAllocator:
    def __init__(self, config=None):
        """
        Mathematical optimization model for resource allocation
        
        Args:
            config (dict): Configuration parameters
        """
        self.config = config or {
            'resource_types': [
                'medical_kits',
                'food_packets',
                'tents',
                'water_containers',
                'rescue_equipment'
            ],
            'transport_modes': {
                'drone': {'capacity': 50, 'speed': 80, 'cost': 2},
                'truck': {'capacity': 1000, 'speed': 40, 'cost': 0.5},
                'helicopter': {'capacity': 200, 'speed': 120, 'cost': 5}
            },
            'priority_weights': {
                'medical': 1.5,
                'rescue': 1.3,
                'essential': 1.1,
                'standard': 1.0
            },
            'max_response_time': 24  # Hours
        }
        self.solver = pywraplp.Solver.CreateSolver('SCIP')
        
    def optimize_transport(self, demands: Dict, locations: Dict) -> Dict:
        """
        Solve transportation problem for resource allocation
        Args:
            demands: {'resource_type': amount_needed}
            locations: {
                'warehouses': [
                    {'id': 'w1', 'inventory': {...}, 'position': (lat, lon)}
                ],
                'disaster_site': (lat, lon)
            }
        Returns:
            Optimal allocation and routing plan
        """
        # Initialize variables
        transport_vars = {}
        for mode in self.config['transport_modes']:
            for wh in locations['warehouses']:
                for res in self.config['resource_types']:
                    transport_vars[(mode, wh['id'], res)] = self.solver.IntVar(
                        0, self.solver.infinity(), 
                        f'{mode}_{wh["id"]}_{res}'
                    )
        
        # Set constraints
        self._add_constraints(transport_vars, demands, locations)
        
        # Set objective: Minimize (cost - priority_score)
        objective = self.solver.Objective()
        for var_key, var in transport_vars.items():
            mode, wh_id, res = var_key
            priority = self._get_priority_weight(res)
            cost = self.config['transport_modes'][mode]['cost']
            objective.SetCoefficient(
                var, 
                cost - (priority * 0.1)  # Balance cost and priority
            )
        objective.SetMinimization()
        
        # Solve
        status = self.solver.Solve()
        
        # Prepare results
        if status == pywraplp.Solver.OPTIMAL:
            return self._prepare_results(
                transport_vars, 
                demands, 
                locations
            )
        else:
            raise RuntimeError("No optimal solution found")
    
    def _add_constraints(self, vars, demands, locations):
        """Add optimization constraints"""
        # 1. Demand satisfaction
        for res in self.config['resource_types']:
            if res in demands:
                self.solver.Add(
                    sum(
                        vars[(mode, wh['id'], res)] 
                        for mode in self.config['transport_modes']
                        for wh in locations['warehouses']
                    ) >= demands[res],
                    f'demand_{res}'
                )
        
        # 2. Warehouse capacity
        for wh in locations['warehouses']:
            for res in self.config['resource_types']:
                self.solver.Add(
                    sum(
                        vars[(mode, wh['id'], res)] 
                        for mode in self.config['transport_modes']
                    ) <= wh['inventory'].get(res, 0),
                    f'capacity_{wh["id"]}_{res}'
                )
        
        # 3. Transport time limits
        for mode, wh in [
            (mode, wh)
            for mode in self.config['transport_modes']
            for wh in locations['warehouses']
        ]:
            distance = self._calculate_distance(
                wh['position'],
                locations['disaster_site']
            )
            transport_time = distance / self.config['transport_modes'][mode]['speed']
            self.solver.Add(
                transport_time <= self.config['max_response_time'],
                f'time_{mode}_{wh["id"]}'
            )
    
    def _calculate_distance(self, pos1, pos2):
        """Haversine distance calculation"""
        lat1, lon1 = pos1
        lat2, lon2 = pos2
        radius = 6371  # Earth radius in km
        
        dlat = np.radians(lat2 - lat1)
        dlon = np.radians(lon2 - lon1)
        a = (np.sin(dlat/2) * np.sin(dlat/2) +
            np.cos(np.radians(lat1)) * np.cos(np.radians(lat2)) *
            np.sin(dlon/2) * np.sin(dlon/2))
        c = 2 * np.arctan2(np.sqrt(a), np.sqrt(1-a))
        return radius * c
    
    def _get_priority_weight(self, resource_type):
        """Get priority multiplier based on resource type"""
        if 'medical' in resource_type:
            return self.config['priority_weights']['medical']
        elif 'rescue' in resource_type:
            return self.config['priority_weights']['rescue']
        elif 'water' in resource_type or 'food' in resource_type:
            return self.config['priority_weights']['essential']
        return self.config['priority_weights']['standard']
    
    def _prepare_results(self, vars, demands, locations):
        """Format optimization results"""
        plan = {
            'allocations': [],
            'total_cost': 0,
            'estimated_arrival_times': [],
            'timestamp': datetime.now().isoformat()
        }
        
        # Extract variable values
        for var_key, var in vars.items():
            if var.solution_value() > 0:
                mode, wh_id, res = var_key
                wh = next(w for w in locations['warehouses'] if w['id'] == wh_id)
                distance = self._calculate_distance(
                    wh['position'],
                    locations['disaster_site']
                )
                time = distance / self.config['transport_modes'][mode]['speed']
                
                allocation = {
                    'resource': res,
                    'source': wh_id,
                    'destination': 'disaster_site',
                    'transport_mode': mode,
                    'quantity': var.solution_value(),
                    'cost': var.solution_value() * self.config['transport_modes'][mode]['cost'],
                    'estimated_hours': round(time, 2),
                    'priority': self._get_priority_weight(res)
                }
                plan['allocations'].append(allocation)
                plan['total_cost'] += allocation['cost']
                plan['estimated_arrival_times'].append(time)
        
        # Calculate metrics
        plan['max_arrival_time'] = max(plan['estimated_arrival_times']) if plan['estimated_arrival_times'] else 0
        plan['fulfillment_percentage'] = round(
            sum(a['quantity'] for a in plan['allocations']) / 
            sum(demands.values()) * 100, 2
        )
        
        return plan
    
    def generate_blockchain_records(self, allocation_plan):
        """
        Prepare allocation records for Hyperledger Fabric
        Args:
            allocation_plan: Output from optimize_transport()
        Returns:
            List of blockchain transactions
        """
        transactions = []
        for alloc in allocation_plan['allocations']:
            tx = {
                'asset_id': f"{alloc['resource']}_{alloc['source']}_{datetime.now().timestamp()}",
                'resource_type': alloc['resource'],
                'quantity': alloc['quantity'],
                'from': alloc['source'],
                'to': alloc['destination'],
                'transport': alloc['transport_mode'],
                'timestamp': allocation_plan['timestamp'],
                'metadata': {
                    'cost': alloc['cost'],
                    'estimated_hours': alloc['estimated_hours'],
                    'priority': alloc['priority']
                }
            }
            transactions.append(tx)
        return transactions
    
    def save_config(self, filepath):
        """Save configuration to JSON"""
        with open(filepath, 'w') as f:
            json.dump(self.config, f)
    
    @classmethod
    def load_config(cls, filepath):
        """Load configuration from JSON"""
        with open(filepath, 'r') as f:
            config = json.load(f)
        return cls(config)
