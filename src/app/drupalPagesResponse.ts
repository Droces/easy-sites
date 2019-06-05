export class DrupalPagesResponse {
  data: [{
    id: string;
    type: string;
    attributes: {
      title: string,
      body: {
        value: string
      };
    };
  }];
}
