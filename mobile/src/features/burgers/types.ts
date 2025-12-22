export type BurgerListItem = {
    id: string;
    name: string;
    ingredients: string[];
    image?: string;
    commentsCount: number;
    collaboratorsCount: number;
  };


  export type BurgerCreatorDto = {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
  };
  
  export type BurgerDetail = {
    id: string;
    name: string;
    ingredients: string[];
    image: string;
    createdAt: string;
    updatedAt: string;
    creator: BurgerCreatorDto;
    commentsCount: number;
    collaboratorsCount: number;
  };


  export type CreateBurgerInput = {
    name: string;
    ingredients: string[];
  };
  
  export type BurgerCreateResponse = {
    id: string;
    name: string;
    ingredients: string[];
    image?: string;
    createdAt: string;
    updatedAt: string;
    creator: {
      id: string;
      name: string;
      email: string;
      isAdmin: boolean;
    };
    commentsCount: number;
    collaboratorsCount: number;
  };