export type CommentDto = {
    id: string;
    text: string;
    createdAt: string;
    updatedAt: string;
    author?: {
      id: string;
      name: string;
      email?: string;
    };
  };


  export type CreateCommentInput = {
    text: string;
  };

  export type CreateCommentResponse = {
    id: string;
    text: string;
    createdAt: string;
    updatedAt: string;
    author?: {
      id: string;
      name: string;
      email?: string;
    };
  };