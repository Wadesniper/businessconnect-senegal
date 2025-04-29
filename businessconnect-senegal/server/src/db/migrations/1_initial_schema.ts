import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  // Création de la table users
  pgm.createTable('users', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('uuid_generate_v4()') },
    name: { type: 'varchar(255)', notNull: true },
    email: { type: 'varchar(255)', notNull: true, unique: true },
    password: { type: 'varchar(255)', notNull: true },
    role: { type: 'varchar(50)', notNull: true, default: 'user' },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') }
  });

  // Création de la table profiles
  pgm.createTable('profiles', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('uuid_generate_v4()') },
    user_id: { type: 'uuid', notNull: true, references: 'users' },
    avatar: { type: 'varchar(255)' },
    bio: { type: 'text' },
    phone: { type: 'varchar(50)' },
    address: { type: 'varchar(255)' },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') }
  });

  // Création de la table jobs
  pgm.createTable('jobs', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('uuid_generate_v4()') },
    title: { type: 'varchar(255)', notNull: true },
    company: { type: 'varchar(255)', notNull: true },
    description: { type: 'text', notNull: true },
    requirements: { type: 'text[]' },
    salary_range: { type: 'varchar(100)' },
    location: { type: 'varchar(255)' },
    type: { type: 'varchar(50)', notNull: true },
    status: { type: 'varchar(50)', notNull: true, default: 'active' },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') }
  });

  // Création de la table applications
  pgm.createTable('applications', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('uuid_generate_v4()') },
    job_id: { type: 'uuid', notNull: true, references: 'jobs' },
    user_id: { type: 'uuid', notNull: true, references: 'users' },
    status: { type: 'varchar(50)', notNull: true, default: 'pending' },
    cover_letter: { type: 'text' },
    resume_url: { type: 'varchar(255)' },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') }
  });

  // Extension pour UUID
  pgm.createExtension('uuid-ossp', { ifNotExists: true });

  // Index
  pgm.createIndex('users', 'email');
  pgm.createIndex('applications', ['job_id', 'user_id']);
  pgm.createIndex('jobs', 'status');
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  // Suppression des tables dans l'ordre inverse de leur création
  pgm.dropTable('applications');
  pgm.dropTable('jobs');
  pgm.dropTable('profiles');
  pgm.dropTable('users');
  pgm.dropExtension('uuid-ossp');
} 