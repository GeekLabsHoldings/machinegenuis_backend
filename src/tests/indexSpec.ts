import supertest from 'supertest';
import app from '../index';
const request = supertest(app);



describe('Main App', () => {
  it('check Health', async () => {
    const response = await request.get('/')
    expect(response.status).toEqual(200);
    expect(response.body).toEqual("Hello world!");
  });
});

