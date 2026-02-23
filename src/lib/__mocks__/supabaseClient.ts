const mockPromptData = {
  id: 'test-id',
  title: 'Test Prompt',
  prompt: 'This is a test prompt',
  full_prompt: 'This is the full test prompt',
  ai_model: 'GPT-4',
  category: 'Test Category',
  price: 0,
  preview_images: ['https://example.com/image1.jpg'],
  creator_id: 'test-creator-id',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  favorites: [{ count: 5 }],
};

function createMockQuery(resolveData: any = [mockPromptData]) {
  const query: any = {
    select: jest.fn().mockImplementation(() => query),
    order: jest.fn().mockImplementation(() => query),
    in: jest.fn().mockImplementation(() => query),
    eq: jest.fn().mockImplementation(() => query),
    neq: jest.fn().mockImplementation(() => query),
    gte: jest.fn().mockImplementation(() => query),
    lte: jest.fn().mockImplementation(() => query),
    ilike: jest.fn().mockImplementation(() => query),
    limit: jest.fn().mockImplementation(() => query),
    maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
    single: jest.fn().mockResolvedValue({ data: mockPromptData, error: null }),
    delete: jest.fn().mockImplementation(() => query),
    insert: jest.fn().mockResolvedValue({ error: null }),
    then: jest.fn().mockImplementation((resolve: any) =>
      Promise.resolve({ data: resolveData, error: null }).then(resolve)
    ),
  };
  return query;
}

const mockQuery = createMockQuery();

const mockAuth = {
  getSession: jest.fn().mockResolvedValue({
    data: { session: null },
    error: null,
  }),
  signInWithPassword: jest.fn().mockResolvedValue({
    data: { user: { id: 'test-user-id', email: 'test@example.com' } },
    error: null,
  }),
  signUp: jest.fn().mockResolvedValue({
    data: { user: { id: 'test-user-id', email: 'test@example.com' } },
    error: null,
  }),
  signOut: jest.fn().mockResolvedValue({ error: null }),
  onAuthStateChange: jest.fn().mockReturnValue({
    data: { subscription: { unsubscribe: jest.fn() } },
  }),
};

export const supabase = {
  from: jest.fn().mockReturnValue(mockQuery),
  auth: mockAuth,
  rpc: jest.fn().mockResolvedValue({
    data: [{ prompt_pack_id: 'test-id', count: 5 }],
    error: null,
  }),
};

export default supabase;
