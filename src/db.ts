import Dexie, { type Table } from 'dexie';
export type Subscriber = {
  id?: number; reference: string; name: string; address: string; commune: string;
  longitude: number | null; latitude: number | null; meter: string; observation: string;
};
export type MissionSubscriber = {
  id?: number; missionId: string; orderNo: string; reference: string; name: string; address: string;
  commune: string; longitude: number | null; latitude: number | null; meter: string;
  unpaidCount: number; amount: number; observation: string; status: string;
};
export type Intervention = {
  id?: number; missionId: string; reference: string; result: string; amount?: number;
  paymentProof?: string; observation: string; agent: string; timestamp: string;
  gpsLat?: number; gpsLng?: number;
};
class FieldDB extends Dexie {
  subscribers!: Table<Subscriber, number>;
  missions!: Table<any, string>;
  missionSubscribers!: Table<MissionSubscriber, number>;
  interventions!: Table<Intervention, number>;
  constructor() {
    super('GestionCoupuresGaz');
    this.version(1).stores({
      subscribers: '++id,&reference,commune',
      missions: '&id,date,status',
      missionSubscribers: '++id,&[missionId+reference],missionId,reference,status,commune',
      interventions: '++id,missionId,reference,timestamp'
    });
  }
}
export const db = new FieldDB();
