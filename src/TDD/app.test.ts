import request from "supertest";
import app from "../app";
const api = request(app);
import { describe, expect, test } from '@jest/globals';



describe('test app', () => {
    test('check healthy', async () => {
        const response = await api.get('/');
        expect(response.status).toEqual(200);
        expect(response.text).toEqual("Hello world!");
    });

});

