-- Resize embedding column from vector(768) to vector(3072)
-- Required because gemini-embedding-001 produces 3072-dimensional vectors
-- (text-embedding-004 which produced 768 dims was deprecated Jan 14 2026)

ALTER TABLE "pdf_chunks" ALTER COLUMN "embedding" TYPE vector(3072);
