export interface LaboratoryDto {
  id: number;
  name: string | null;
  location: string | null;
  capacity: number;
  created_date: string | null;
}

export interface LaboratoryRequestDto {
  name: string;
  location?: string | null;
  capacity?: number;
}
