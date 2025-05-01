import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  // Table des modules
  pgm.createTable('modules', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('uuid_generate_v4()') },
    title: { type: 'varchar(255)', notNull: true },
    description: { type: 'text' },
    duration: { type: 'integer', notNull: true }, // en minutes
    content: { type: 'text', notNull: true },
    order: { type: 'integer', notNull: true },
    formation_id: { type: 'uuid', notNull: true },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') }
  });

  // Table des formations
  pgm.createTable('formations', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('uuid_generate_v4()') },
    title: { type: 'varchar(255)', notNull: true },
    description: { type: 'text', notNull: true },
    category: {
      type: 'varchar(50)',
      notNull: true,
      check: "category IN ('développement', 'business', 'marketing', 'design', 'langues', 'soft-skills')"
    },
    level: {
      type: 'varchar(20)',
      notNull: true,
      check: "level IN ('débutant', 'intermédiaire', 'avancé')"
    },
    duration: { type: 'integer', notNull: true }, // durée totale en minutes
    price: { type: 'decimal(10,2)', notNull: true },
    instructor_id: { type: 'uuid', notNull: true, references: 'users' },
    thumbnail: { type: 'varchar(255)', notNull: true },
    requirements: { type: 'text[]', default: '{}' },
    objectives: { type: 'text[]', default: '{}' },
    rating: { type: 'decimal(3,2)', default: 0 },
    number_of_ratings: { type: 'integer', default: 0 },
    status: {
      type: 'varchar(20)',
      notNull: true,
      default: 'draft',
      check: "status IN ('draft', 'published', 'archived')"
    },
    featured: { type: 'boolean', default: false },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') }
  });

  // Table des inscriptions aux formations
  pgm.createTable('formation_enrollments', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('uuid_generate_v4()') },
    formation_id: { type: 'uuid', notNull: true, references: 'formations' },
    user_id: { type: 'uuid', notNull: true, references: 'users' },
    enrolled_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
    completed_at: { type: 'timestamp' },
    progress: { type: 'integer', default: 0 }, // pourcentage de progression
    last_accessed_at: { type: 'timestamp' }
  });

  // Table des évaluations des formations
  pgm.createTable('formation_ratings', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('uuid_generate_v4()') },
    formation_id: { type: 'uuid', notNull: true, references: 'formations' },
    user_id: { type: 'uuid', notNull: true, references: 'users' },
    rating: { type: 'integer', notNull: true, check: 'rating >= 0 AND rating <= 5' },
    comment: { type: 'text' },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') }
  });

  // Index
  pgm.createIndex('modules', ['formation_id']);
  pgm.createIndex('formations', ['instructor_id']);
  pgm.createIndex('formations', ['category']);
  pgm.createIndex('formations', ['level']);
  pgm.createIndex('formations', ['status']);
  pgm.createIndex('formations', ['featured']);
  pgm.createIndex('formation_enrollments', ['formation_id', 'user_id'], { unique: true });
  pgm.createIndex('formation_ratings', ['formation_id', 'user_id'], { unique: true });

  // Triggers pour la mise à jour automatique de updated_at
  pgm.createFunction(
    'update_updated_at_column',
    [],
    {
      returns: 'trigger',
      language: 'plpgsql',
    },
    `
    BEGIN
      NEW.updated_at = current_timestamp;
      RETURN NEW;
    END;
    `
  );

  pgm.createTrigger('formations', 'update_updated_at_trigger', {
    when: 'BEFORE',
    operation: 'UPDATE',
    function: 'update_updated_at_column',
    level: 'ROW'
  });

  pgm.createTrigger('modules', 'update_updated_at_trigger', {
    when: 'BEFORE',
    operation: 'UPDATE',
    function: 'update_updated_at_column',
    level: 'ROW'
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  // Supprimer les triggers
  pgm.dropTrigger('modules', 'update_updated_at_trigger');
  pgm.dropTrigger('formations', 'update_updated_at_trigger');
  pgm.dropFunction('update_updated_at_column', []);

  // Supprimer les tables
  pgm.dropTable('formation_ratings');
  pgm.dropTable('formation_enrollments');
  pgm.dropTable('modules');
  pgm.dropTable('formations');
} 