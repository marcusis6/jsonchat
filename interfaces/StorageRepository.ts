interface StorageRepository<T> {
  add(item: T): Promise<T>;
  get(): Promise<T[]>;
  update(item: T): Promise<T>;
  remove(id: string): Promise<boolean>;
}

export { StorageRepository };
