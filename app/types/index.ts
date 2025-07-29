export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  githubUrl: string;
  linkedinUrl: string;
  summary: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  location: string;
  description: string;
  technologies: string[];
}

export interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
  description?: string;
}

export interface Skill {
  category: string;
  items: string[];
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
  imageUrl?: string;
}

export interface Resume {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
}

export interface Image {
  id: string;
  name: string;
  url: string;
  type: 'profile' | 'background';
  uploadedAt: string;
}

export interface DatabaseConnection {
  connected: boolean;
  lastCheck: Date;
  error?: string;
}

export interface D1Config {
  enabled: boolean;
  status: 'connected' | 'disconnected' | 'loading' | 'error';
  lastSync?: Date;
  error?: string;
}

export interface R2Config {
  enabled: boolean;
  status: 'connected' | 'disconnected' | 'loading' | 'error';
  bucketName?: string;
  totalFiles?: number;
  totalSize?: string;
  error?: string;
}

export interface EditSession {
  id: string;
  token: string;
  isActive: boolean;
  startTime: Date;
  lastActivity: Date;
  changes: EditChange[];
}

export interface EditChange {
  id: string;
  type: 'personal_info' | 'experience' | 'education' | 'skill' | 'project';
  action: 'create' | 'update' | 'delete';
  field?: string;
  oldValue?: any;
  newValue?: any;
  timestamp: Date;
}

export interface EditableField {
  id: string;
  type: 'text' | 'textarea' | 'array' | 'date' | 'url';
  section: string;
  path: string;
  value: any;
  originalValue: any;
  isEditing: boolean;
  isDirty: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface SaveRequest {
  changes: EditChange[];
  password?: string;
  sessionToken: string;
}

export interface DialogConfig {
  type: 'success' | 'error' | 'warning' | 'info' | 'confirm';
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  autoClose?: number; // milliseconds
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  timestamp: Date;
}

export interface WorkerEnv {
  DB: D1Database;
  R2: R2Bucket;
  ENVIRONMENT: string;
}

export interface D1Database {
  prepare: (query: string) => D1PreparedStatement;
  dump: () => Promise<ArrayBuffer>;
  batch: (statements: D1PreparedStatement[]) => Promise<D1Result[]>;
  exec: (query: string) => Promise<D1ExecResult>;
}

export interface D1PreparedStatement {
  bind: (...values: any[]) => D1PreparedStatement;
  first: <T = any>(colName?: string) => Promise<T | null>;
  run: () => Promise<D1Result>;
  all: <T = any>() => Promise<D1Result<T>>;
  raw: <T = any>() => Promise<T[]>;
}

export interface D1Result<T = any> {
  results?: T[];
  success: boolean;
  error?: string;
  meta: {
    duration: number;
    changes: number;
    last_row_id: number;
    rows_read: number;
    rows_written: number;
    size_after: number;
  };
}

export interface D1ExecResult {
  count: number;
  duration: number;
}

export interface R2Bucket {
  get: (key: string) => Promise<R2Object | null>;
  put: (key: string, value: ReadableStream | ArrayBuffer | string, options?: R2PutOptions) => Promise<R2Object>;
  delete: (key: string) => Promise<void>;
  list: (options?: R2ListOptions) => Promise<R2Objects>;
  head: (key: string) => Promise<R2Object | null>;
}

export interface R2Object {
  key: string;
  version: string;
  size: number;
  etag: string;
  httpEtag: string;
  uploaded: Date;
  checksums: Record<string, string>;
  httpMetadata?: R2HTTPMetadata;
  customMetadata?: Record<string, string>;
  range?: R2Range;
  body?: ReadableStream;
  bodyUsed?: boolean;
  arrayBuffer: () => Promise<ArrayBuffer>;
  text: () => Promise<string>;
  json: <T = any>() => Promise<T>;
  blob: () => Promise<Blob>;
}

export interface R2PutOptions {
  httpMetadata?: R2HTTPMetadata;
  customMetadata?: Record<string, string>;
  md5?: ArrayBuffer | string;
  sha1?: ArrayBuffer | string;
  sha256?: ArrayBuffer | string;
  sha384?: ArrayBuffer | string;
  sha512?: ArrayBuffer | string;
}

export interface R2HTTPMetadata {
  contentType?: string;
  contentLanguage?: string;
  contentDisposition?: string;
  contentEncoding?: string;
  cacheControl?: string;
  cacheExpiry?: Date;
}

export interface R2ListOptions {
  limit?: number;
  prefix?: string;
  cursor?: string;
  delimiter?: string;
}

export interface R2Objects {
  objects: R2Object[];
  truncated: boolean;
  cursor?: string;
  delimitedPrefixes: string[];
}

export interface R2Range {
  offset: number;
  length: number;
}

export interface DebugPanelProps {
  isDarkTheme?: boolean;
  d1Config?: D1Config;
  r2Config?: R2Config;
  onD1Toggle?: () => Promise<void>;
  onR2Toggle?: () => Promise<void>;
}

export interface ResumeViewerProps {
  resume: Resume;
  isDarkTheme?: boolean;
  isEditing?: boolean;
  onFieldEdit?: (field: EditableField) => void;
  editSession?: EditSession;
} 