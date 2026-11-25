// Netlify Function: the whole admin API (Express) behind /api/*
import serverless from 'serverless-http';
import { connectLambda } from '@netlify/blobs';
import { createApp } from '../../server/app.js';

const handle = serverless(createApp(), { binary: ['image/*'] });

export const handler = async (event, context) => {
  connectLambda(event); // gives Netlify Blobs access inside this function
  context.callbackWaitsForEmptyEventLoop = false; // keep the MongoDB connection open between calls
  return handle(event, context);
};
