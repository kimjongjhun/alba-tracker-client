interface Client {
  id: string;
  active: boolean;
}

interface Location {
  id: string;
  active: boolean;
  name: string;
  address: string;
  clients: Client[];
  createdAt: string;
  editedAt: string;
  deletedAt: string;
}

export type { Location, Client };
