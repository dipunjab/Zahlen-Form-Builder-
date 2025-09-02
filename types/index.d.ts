type Form  = {
  _id?: string;                  
  userId: string;                
  title: string;
  description?: string;
  fields: FormField[];
  published?: boolean;           
  publishedAt?: string;            
  logo?: string;                 
  cover?: string;                
  color?: string;                
  createdAt?: Date;
  updatedAt?: Date;
}