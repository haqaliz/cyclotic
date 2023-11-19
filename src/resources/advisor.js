const fetch = require('node-fetch');

const ORIGIN = 'https://api.dify.ai/v1';
const REQUEST_OPTIONS = {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.DIFY_SECRET_KEY}`
  },
};

const createMessage = async (payload) => {
  const r = await fetch(`${ORIGIN}/chat-messages`, {
    ...REQUEST_OPTIONS,
    method: 'POST',
		body: JSON.stringify({
      inputs: {},
      conversation_id: payload?.conversation_id ? payload.conversation_id : '',
      user: payload?.user_id,
      response_mode: 'blocking',
      query: payload?.query,
    })
  }).catch((e) => e.response);
  if (!r?.ok) return;
	return r.json();
};

const getConversationMessages = async (payload) => {
  const firstId = payload?.first_id ? `&first_id=${payload.first_id}` : '';
  const r = await fetch(`${ORIGIN}/messages?conversation_id=${
    payload?.conversation_id
  }&user=${
    payload?.user_id
  }&limit=${
    payload?.limit
  }${firstId}`, {
    ...REQUEST_OPTIONS,
    method: 'GET',
  }).catch((e) => e.response);
  if (!r?.ok) return;
	return r.json();
};

const deleteConversation = async (payload) => {
  const r = await fetch(`${ORIGIN}/conversations/${payload?.conversation_id}`, {
    ...REQUEST_OPTIONS,
    method: 'DELETE',
    body: JSON.stringify({
      user: payload?.user_id,
    }),
  }).catch((e) => e.response);
  return !!r?.ok;
};

const getConversationsList = async (payload) => {
  const lastId = payload?.last_id ? `&last_id=${payload.last_id}` : '';
  const r = await fetch(`${ORIGIN}/conversations?user=${
    payload?.user_id
  }&limit=${
    payload?.limit
  }${lastId}`, {
    ...REQUEST_OPTIONS,
    method: 'GET',
  }).catch((e) => e.response);
  if (!r?.ok) return;
	return r.json();
};

module.exports = {
  createMessage,
  getConversationMessages,
  deleteConversation,
  getConversationsList,
};