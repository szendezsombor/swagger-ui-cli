export interface CliTaskArguments {
  command: 'serve' | 'build';
  specFile: string;
  flags?: string[];
}
