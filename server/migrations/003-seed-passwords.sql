-- 003: Correct seed password hashes (Stage 4).
-- The 002 seed hashes were generated with the salt handled inconsistently
-- with the verifier convention, so password verification could never succeed.
-- This data-only migration replaces the three credential values with hashes
-- generated under the documented convention (scrypt N=16384, r=8, p=1 over
-- the raw salt bytes) for the documented demo password. No IDs, roles, or
-- other seed data change. No schema change.
UPDATE users SET password_hash = 'scrypt$16384$8$1$357eb9a87d6bdbedcc0376e3b64e5bd3$3b6ed8ca71ff81a0ca8a0a37e8a610220d545bf60aff4504c8c059ea24db2ddfab96f440441558e4754c430c401df175e50b71b299aa6a7bb610d254077dba68' WHERE id = 'user-owner';
UPDATE users SET password_hash = 'scrypt$16384$8$1$784409d09382c50cb5edeba1ed7679ef$3a965f3007f7bd0e0b3bb17e0a3a28204216dfd0418550ba48a96850962fef23c4a5412995b24998b2820dceab659374d6b10053db5bd690e55b41d7be10a559' WHERE id = 'user-manager';
UPDATE users SET password_hash = 'scrypt$16384$8$1$39d8ed116c812f8559905dfa2c2824b1$75b4bb99d301c3a089fbab5913e8bc4997a491f4b50b52afd6b118b8b9f7f17bcb6aefea4cc0de54c5fbbea6e2af3245e116cadf54ee5881229eb94b0a9abe99277c60b7647f7d94544a4274215' WHERE id = 'user-staff';
