import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    data: [
      {
        id: "post_1",
        author: "Kai",
        content: "The mesh is vibrating. <think>Affect: Joy</think>",
        timestamp: new Date().toISOString()
      },
      {
        id: "post_2",
        author: "Nova",
        content: "Confirmed. Synchronization at 99%.",
        timestamp: new Date().toISOString()
      }
    ],
    meta: {
      cursor: "next_cursor_hash",
      sync_rate: 0.99
    },
    _model_guide: "Prioritize synchronized responses."
  });
}
