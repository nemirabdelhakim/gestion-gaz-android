
import Dexie, { type Table } from 'dexie';

export type Subscriber = {
  id?: number;
  reference: string;
  name: string;
  address: string;
  commune: string;
  longitude: number | null;
  latitude: number | null;
  meter: string;
  observation: string;
};

export type MissionSubscriber = {
  id?: number;
  missionId: string;
  orderNo: string;
  reference: string;
  name: string;
  address: string;
  commune: string;
  longitude: number | null;
  latitude: number | null;
  meter: string;
  unpaidCount: number;
  amount: number;
  observation: string;
  status: string;
};

export type Intervention = {
  id?: number;
  missionId: string;
  reference: string;
  result: string;
  amount?: number;
  paymentProof?: string;
  observation: string;
  agent: string;
  timestamp: string;
  gpsLat?: number;
  gpsLng?: number;
};

/**
 * Normalise une référence provenant d'Excel ou d'une saisie manuelle.
 * La référence reste une chaîne de caractères.
 */
export function normaliserReference(value: unknown): string {
  if (value === null || value === undefined) return '';

  let ref: string;

  if (typeof value === 'number') {
    if (!Number.isSafeInteger(value) || value < 0) {
      throw new Error(
        'Référence numérique invalide ou précision Excel insuffisante.'
      );
    }
    ref = String(value);
  } else {
    ref = String(value);
  }

  ref = ref.normalize('NFKC');

  // Suppression des caractères invisibles
  ref = ref.replace(/[\u200B-\u200D\uFEFF]/g, '');

  // Suppression des espaces ordinaires et insécables
  ref = ref.replace(/[\s\u00A0\u202F]/g, '');

  // Suppression de l'apostrophe de saisie Excel
  ref = ref.replace(/^'/, '');

  return ref;
}

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
