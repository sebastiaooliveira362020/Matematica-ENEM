import { describe, it, expect, beforeEach } from 'vitest';
import { StorageManager } from '../storageManager';

describe('StorageManager', () => {
  beforeEach(() => {
    StorageManager.resetarProgresso();
  });

  it('deve inicializar com perfil padrão limpo', () => {
    const progresso = StorageManager.carregarProgresso();
    expect(progresso.versaoSchema).toBe(1);
    expect(Object.keys(progresso.licoesStatus).length).toBe(0);
  });

  it('deve atualizar e persistir a fase atual da lição', () => {
    StorageManager.atualizarFaseLicao('licao-1', 4);
    const carregado = StorageManager.carregarProgresso();
    expect(carregado.licoesStatus['licao-1'].faseAtual).toBe(4);
    expect(carregado.licoesStatus['licao-1'].status).toBe('em_andamento');
  });

  it('deve exportar e importar JSON com fidelidade', () => {
    StorageManager.atualizarFaseLicao('licao-1', 5);
    const jsonStr = StorageManager.exportarProgressoJSON();

    StorageManager.resetarProgresso();
    expect(StorageManager.carregarProgresso().licoesStatus['licao-1']).toBeUndefined();

    const ok = StorageManager.importarProgressoJSON(jsonStr);
    expect(ok).toBe(true);
    expect(StorageManager.carregarProgresso().licoesStatus['licao-1'].faseAtual).toBe(5);
  });
});
