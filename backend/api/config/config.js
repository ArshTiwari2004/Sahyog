export const mongoURI = process.env.MONGO_URI || 'mongodb+srv://workfromhome02298:Lockdown12345@heisenbergcluster.mmlmd.mongodb.net/Sahyog';
export const jwtSecret = process.env.JWT_SECRET || 'TEAMSYNAPSE';
export const jwtExpiration = process.env.JWT_EXPIRATION || '24h';
export const roles = {
    citizen: 'citizen',
    responder: 'responder',
    admin: 'admin'
};