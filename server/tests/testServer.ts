import express, { Express } from 'express'

export function testServer(route: (app: Express) => void) {
  const app = express()
  route(app)
}
