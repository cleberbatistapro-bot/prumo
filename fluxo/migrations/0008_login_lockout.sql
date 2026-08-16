-- Rate limiting real no login: trava a conta por um tempo depois de tentativas
-- seguidas erradas, em vez de deixar tentar senha infinitas vezes.
ALTER TABLE users ADD COLUMN failed_attempts INTEGER NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN locked_until TEXT;
