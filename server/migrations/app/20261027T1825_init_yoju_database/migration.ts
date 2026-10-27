#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/6ec0e2f33abbff93db86ac3c8a27a0b3a0324c7f6d370cd4a9fec1e90d434452/contract';
import endContract from '../../snapshots/6ec0e2f33abbff93db86ac3c8a27a0b3a0324c7f6d370cd4a9fec1e90d434452/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/a51b4833fdaffe730572670ccc27dd89af7e0726ab3de7f428d21702d687cc15/contract';
import startContract from '../../snapshots/a51b4833fdaffe730572670ccc27dd89af7e0726ab3de7f428d21702d687cc15/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  col,
  fn,
  lit,
  primaryKey,
  sql,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropTable({ schema: 'public', table: 'Post' }),
      this.dropTable({ schema: 'public', table: 'User' }),
      this.createTable({
        schema: 'public',
        table: 'categories',
        columns: [
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'order_items',
        columns: [
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('order_id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('price_at_purchase', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('product_id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('product_name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('quantity', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'orders',
        columns: [
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('delivery_address', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('idempotency_key', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('total_price', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('updated_at', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('user_id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'product_images',
        columns: [
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('image_url', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('product_id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('sort_order', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'product_tags',
        columns: [
          col('added_at', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('product_id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('tag_id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['product_id', 'tag_id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'products',
        columns: [
          col('category_id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('description', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('is_limited', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('price', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('specifications', 'json', { codecRef: { codecId: 'pg/json@1' } }),
          col('stock_quantity', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('updated_at', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'reviews',
        columns: [
          col('comment', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('has_complaint', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('is_hidden', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('product_id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('rating', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('user_id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'tags',
        columns: [
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'users',
        columns: [
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('managed_category_id', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('password_hash', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('role', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'categories',
        constraint: 'categories_name_key',
        columns: ['name'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'orders',
        constraint: 'orders_idempotency_key_key',
        columns: ['idempotency_key'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'reviews',
        constraint: 'reviews_user_id_product_id_key',
        columns: ['user_id', 'product_id'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'tags',
        constraint: 'tags_name_key',
        columns: ['name'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'users',
        constraint: 'users_email_key',
        columns: ['email'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'order_items',
        index: 'order_items_order_id_idx_39ad19ad',
        columns: ['order_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'order_items',
        index: 'order_items_product_id_idx_22a2b7d2',
        columns: ['product_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'orders',
        index: 'orders_user_id_idx_6c952402',
        columns: ['user_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'product_images',
        index: 'product_images_product_id_idx_22a2b7d2',
        columns: ['product_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'product_tags',
        index: 'product_tags_product_id_idx_22a2b7d2',
        columns: ['product_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'product_tags',
        index: 'product_tags_tag_id_idx_94b47830',
        columns: ['tag_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'products',
        index: 'products_category_id_idx_da7213d4',
        columns: ['category_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'reviews',
        index: 'reviews_product_id_idx_22a2b7d2',
        columns: ['product_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'reviews',
        index: 'reviews_user_id_idx_6c952402',
        columns: ['user_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'users',
        index: 'users_managed_category_id_idx_14da0ef7',
        columns: ['managed_category_id'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'order_items',
        foreignKey: {
          name: 'order_items_order_id_fkey',
          columns: ['order_id'],
          references: { schema: 'public', table: 'orders', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'order_items',
        foreignKey: {
          name: 'order_items_product_id_fkey',
          columns: ['product_id'],
          references: { schema: 'public', table: 'products', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'orders',
        foreignKey: {
          name: 'orders_user_id_fkey',
          columns: ['user_id'],
          references: { schema: 'public', table: 'users', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'product_images',
        foreignKey: {
          name: 'product_images_product_id_fkey',
          columns: ['product_id'],
          references: { schema: 'public', table: 'products', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'product_tags',
        foreignKey: {
          name: 'product_tags_product_id_fkey',
          columns: ['product_id'],
          references: { schema: 'public', table: 'products', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'product_tags',
        foreignKey: {
          name: 'product_tags_tag_id_fkey',
          columns: ['tag_id'],
          references: { schema: 'public', table: 'tags', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'products',
        foreignKey: {
          name: 'products_category_id_fkey',
          columns: ['category_id'],
          references: { schema: 'public', table: 'categories', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'reviews',
        foreignKey: {
          name: 'reviews_user_id_fkey',
          columns: ['user_id'],
          references: { schema: 'public', table: 'users', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'reviews',
        foreignKey: {
          name: 'reviews_product_id_fkey',
          columns: ['product_id'],
          references: { schema: 'public', table: 'products', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'users',
        foreignKey: {
          name: 'users_managed_category_id_fkey',
          columns: ['managed_category_id'],
          references: { schema: 'public', table: 'categories', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
