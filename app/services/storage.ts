/**
 * Serviço para interagir com Cloudflare R2 Storage
 */

import type { 
  ApiResponse,
  R2Bucket,
  R2Object,
  R2Config
} from '~/types';

export class StorageService {
  private r2: R2Bucket;
  private bucketName: string;

  constructor(r2Bucket: R2Bucket, bucketName: string = 'curriculo-images') {
    this.r2 = r2Bucket;
    this.bucketName = bucketName;
  }

  /**
   * Upload de arquivo para R2
   */
  async uploadFile(
    key: string, 
    file: File | ArrayBuffer | string, 
    contentType?: string
  ): Promise<ApiResponse<{ url: string; key: string }>> {
    try {
      const options = contentType ? { 
        httpMetadata: { contentType } 
      } : undefined;

      const result = await this.r2.put(key, file, options);

      if (!result) {
        throw new Error('Falha no upload do arquivo');
      }

      // URL pública do arquivo (ajustar conforme configuração do R2)
      const url = `https://${this.bucketName}.r2.dev/${key}`;

      return {
        success: true,
        data: {
          url,
          key: result.key
        },
        message: 'Arquivo enviado com sucesso'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro no upload'
      };
    }
  }

  /**
   * Download de arquivo do R2
   */
  async getFile(key: string): Promise<ApiResponse<R2Object>> {
    try {
      const object = await this.r2.get(key);

      if (!object) {
        return {
          success: false,
          error: 'Arquivo não encontrado'
        };
      }

      return {
        success: true,
        data: object,
        message: 'Arquivo recuperado com sucesso'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao buscar arquivo'
      };
    }
  }

  /**
   * Listar arquivos no bucket
   */
  async listFiles(prefix?: string, limit: number = 100): Promise<ApiResponse<{
    files: Array<{
      key: string;
      size: number;
      lastModified: Date;
      url: string;
    }>;
    totalCount: number;
    totalSize: number;
  }>> {
    try {
      const result = await this.r2.list({
        prefix,
        limit
      });

      const files = result.objects.map(obj => ({
        key: obj.key,
        size: obj.size,
        lastModified: obj.uploaded,
        url: `https://${this.bucketName}.r2.dev/${obj.key}`
      }));

      const totalSize = files.reduce((sum, file) => sum + file.size, 0);

      return {
        success: true,
        data: {
          files,
          totalCount: files.length,
          totalSize
        },
        message: `${files.length} arquivos encontrados`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao listar arquivos'
      };
    }
  }

  /**
   * Deletar arquivo do R2
   */
  async deleteFile(key: string): Promise<ApiResponse<void>> {
    try {
      await this.r2.delete(key);

      return {
        success: true,
        message: 'Arquivo deletado com sucesso'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao deletar arquivo'
      };
    }
  }

  /**
   * Upload de imagem de perfil
   */
  async uploadProfileImage(file: File): Promise<ApiResponse<{ url: string }>> {
    try {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        return {
          success: false,
          error: 'Apenas arquivos de imagem são permitidos'
        };
      }

      // Validar tamanho (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        return {
          success: false,
          error: 'Arquivo muito grande. Máximo 5MB permitido'
        };
      }

      // Gerar nome único para a imagem
      const timestamp = Date.now();
      const extension = file.name.split('.').pop();
      const key = `profile/avatar-${timestamp}.${extension}`;

      const result = await this.uploadFile(key, file, file.type);

      if (!result.success) {
        return result;
      }

      return {
        success: true,
        data: {
          url: result.data!.url
        },
        message: 'Imagem de perfil enviada com sucesso'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro no upload da imagem'
      };
    }
  }

  /**
   * Upload de imagem de projeto
   */
  async uploadProjectImage(file: File, projectId: string): Promise<ApiResponse<{ url: string }>> {
    try {
      if (!file.type.startsWith('image/')) {
        return {
          success: false,
          error: 'Apenas arquivos de imagem são permitidos'
        };
      }

      const maxSize = 10 * 1024 * 1024; // 10MB para projetos
      if (file.size > maxSize) {
        return {
          success: false,
          error: 'Arquivo muito grande. Máximo 10MB permitido'
        };
      }

      const timestamp = Date.now();
      const extension = file.name.split('.').pop();
      const key = `projects/${projectId}/image-${timestamp}.${extension}`;

      const result = await this.uploadFile(key, file, file.type);

      if (!result.success) {
        return result;
      }

      return {
        success: true,
        data: {
          url: result.data!.url
        },
        message: 'Imagem do projeto enviada com sucesso'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro no upload da imagem'
      };
    }
  }

  /**
   * Obter estatísticas do bucket
   */
  async getBucketStats(): Promise<ApiResponse<R2Config>> {
    try {
      const listResult = await this.listFiles();
      
      if (!listResult.success) {
        throw new Error(listResult.error);
      }

      const { totalCount, totalSize } = listResult.data!;
      
      // Converter bytes para formato legível
      const formatSize = (bytes: number): string => {
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;

        while (size >= 1024 && unitIndex < units.length - 1) {
          size /= 1024;
          unitIndex++;
        }

        return `${size.toFixed(2)} ${units[unitIndex]}`;
      };

      const config: R2Config = {
        enabled: true,
        status: 'connected',
        bucketName: this.bucketName,
        totalFiles: totalCount,
        totalSize: formatSize(totalSize)
      };

      return {
        success: true,
        data: config,
        message: 'Estatísticas do R2 obtidas com sucesso'
      };
    } catch (error) {
      const config: R2Config = {
        enabled: false,
        status: 'error',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };

      return {
        success: false,
        data: config,
        error: error instanceof Error ? error.message : 'Erro ao obter estatísticas do R2'
      };
    }
  }

  /**
   * Testar conexão com R2
   */
  async testConnection(): Promise<ApiResponse<{ bucketName: string; accessible: boolean }>> {
    try {
      // Tentar listar arquivos como teste de conectividade
      await this.r2.list({ limit: 1 });

      return {
        success: true,
        data: {
          bucketName: this.bucketName,
          accessible: true
        },
        message: 'Conexão com R2 estabelecida'
      };
    } catch (error) {
      return {
        success: false,
        data: {
          bucketName: this.bucketName,
          accessible: false
        },
        error: error instanceof Error ? error.message : 'Erro na conexão com R2'
      };
    }
  }
}