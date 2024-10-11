interface RateInfo {
  rate: string;
  active: boolean;
}

interface LocationInfo {
  id: string;
  name: string;
  address: string;
  active: boolean;
}

interface Client {
  id: string;
  name: string;
  createdAt: string;
  editedAt: string;
  deletedAt: string | null;
  active: boolean;
  rateInfo: RateInfo[];
  locationInfo: LocationInfo[];
}
export type { Client, RateInfo, LocationInfo };
