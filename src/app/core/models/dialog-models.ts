export type DialogConfig<T> = {
  mode: 'add' | 'update' | 'delete' | 'details';
  title: string;
  row?: T;
} | null;
export interface DialogConfirm<T> {
  mode: 'add' | 'update' | 'delete' | 'details';
  data: T;
}
