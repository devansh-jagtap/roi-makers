-- CreateEnum
CREATE TYPE "ChatAudience" AS ENUM ('PUBLIC', 'DASHBOARD');

-- CreateEnum
CREATE TYPE "ChatRole" AS ENUM ('USER', 'ASSISTANT');

-- CreateTable
CREATE TABLE "chat_conversations" (
    "id" TEXT NOT NULL,
    "audience" "ChatAudience" NOT NULL,
    "session_key" TEXT NOT NULL,
    "profile_id" TEXT,
    "title" TEXT,
    "summary" TEXT,
    "visitor_name" TEXT,
    "visitor_email" TEXT,
    "lead_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_message_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chat_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_messages" (
    "id" TEXT NOT NULL,
    "conversation_id" TEXT NOT NULL,
    "role" "ChatRole" NOT NULL,
    "content" TEXT NOT NULL,
    "parts" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "chat_conversations_session_key_key" ON "chat_conversations"("session_key");

-- CreateIndex
CREATE INDEX "chat_conversations_audience_idx" ON "chat_conversations"("audience");

-- CreateIndex
CREATE INDEX "chat_conversations_profile_id_idx" ON "chat_conversations"("profile_id");

-- CreateIndex
CREATE INDEX "chat_conversations_expires_at_idx" ON "chat_conversations"("expires_at");

-- CreateIndex
CREATE INDEX "chat_messages_conversation_id_created_at_idx" ON "chat_messages"("conversation_id", "created_at");

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "chat_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Keep direct browser access denied, matching prisma/supabase-rls.sql.
ALTER TABLE "chat_conversations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "chat_messages" ENABLE ROW LEVEL SECURITY;
