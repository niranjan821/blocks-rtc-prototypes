import Gun, { IGunChain, IGunInstance } from 'gun';
let gun: IGunInstance;
let nodes: IGunChain<any>;



export const connectToGun = () => {
  console.log('connectToGun')
    gun = Gun({
      peers: ['http:localhost:8000/gun'] // Put the relay node that you want here
    })
    nodes = gun.get('nodes');
}

export const getGun = () => gun;
export const getNodes = () => nodes;
