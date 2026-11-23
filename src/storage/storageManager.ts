import { ItemRevisaoEspacada, PerfilEstudanteProgresso, ResultadoTentativaQuiz } from '../core/types';

const STORAGE_KEY = 'plataforma_matematica_enem_progresso_v1';

function criarEstadoInicial(): PerfilEstudanteProgresso {
  return {
    versaoSchema: 1,
    ultimaAtualizacao: new Date().toISOString(),
    licoesStatus: {},
    historicoTentativas: [],
    revisoesAgendadas: [],
  };
}

// Fallback em memória para ambientes restritos, SSR ou testes
let memoryStorage: Record<string, string> = {};

function getStorageItem(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const val = window.localStorage.getItem(key);
      if (val !== null) return val;
    }
  } catch {
    // fallback
  }
  return memoryStorage[key] ?? null;
}

function setStorageItem(key: string, value: string): void {
  memoryStorage[key] = value;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  } catch {
    // fallback
  }
}

function removeStorageItem(key: string): void {
  delete memoryStorage[key];
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  } catch {
    // fallback
  }
}

export class StorageManager {
  /**
   * Carrega o progresso persistido ou retorna o estado inicial
   */
  public static carregarProgresso(): PerfilEstudanteProgresso {
    try {
      const data = getStorageItem(STORAGE_KEY);
      if (!data) return criarEstadoInicial();
      const parsed = JSON.parse(data);
      return {
        ...criarEstadoInicial(),
        ...parsed,
        licoesStatus: parsed.licoesStatus || {},
        historicoTentativas: parsed.historicoTentativas || [],
        revisoesAgendadas: parsed.revisoesAgendadas || [],
      };
    } catch (e) {
      console.warn('Falha ao carregar progresso do LocalStorage. Utilizando padrão inicial.', e);
      return criarEstadoInicial();
    }
  }

  /**
   * Salva o progresso no armazenamento local
   */
  public static salvarProgresso(progresso: PerfilEstudanteProgresso): void {
    try {
      progresso.ultimaAtualizacao = new Date().toISOString();
      setStorageItem(STORAGE_KEY, JSON.stringify(progresso));
    } catch (e) {
      console.error('Falha ao salvar progresso no LocalStorage.', e);
    }
  }

  /**
   * Atualiza a fase atual que o aluno está cursando em uma lição
   */
  public static atualizarFaseLicao(licaoId: string, fase: number): PerfilEstudanteProgresso {
    const progresso = this.carregarProgresso();
    if (!progresso.licoesStatus[licaoId]) {
      progresso.licoesStatus[licaoId] = {
        status: 'em_andamento',
        faseAtual: fase,
        maiorAproveitamento: 0,
        tentativasTotais: 0,
      };
    } else {
      progresso.licoesStatus[licaoId].faseAtual = fase;
      if (progresso.licoesStatus[licaoId].status === 'nao_iniciado') {
        progresso.licoesStatus[licaoId].status = 'em_andamento';
      }
    }
    this.salvarProgresso(progresso);
    return progresso;
  }

  /**
   * Registra o resultado completo de uma tentativa de quiz final
   */
  public static registrarResultadoQuiz(
    resultado: ResultadoTentativaQuiz,
    novaRevisao?: ItemRevisaoEspacada
  ): PerfilEstudanteProgresso {
    const progresso = this.carregarProgresso();

    progresso.historicoTentativas.push(resultado);

    const licaoAtual = progresso.licoesStatus[resultado.licaoId] || {
      status: 'em_andamento',
      faseAtual: 9,
      maiorAproveitamento: 0,
      tentativasTotais: 0,
    };

    licaoAtual.tentativasTotais++;
    if (resultado.percentualGeral > licaoAtual.maiorAproveitamento) {
      licaoAtual.maiorAproveitamento = resultado.percentualGeral;
    }

    if (resultado.percentualGeral >= 80) {
      licaoAtual.status = 'concluido';
    } else {
      licaoAtual.status = 'necessita_revisao';
    }

    progresso.licoesStatus[resultado.licaoId] = licaoAtual;

    if (novaRevisao) {
      // Remove agendamentos antigos não concluídos da mesma lição
      progresso.revisoesAgendadas = progresso.revisoesAgendadas.filter(
        (r) => r.licaoId !== resultado.licaoId || r.concluida
      );
      progresso.revisoesAgendadas.push(novaRevisao);
    }

    this.salvarProgresso(progresso);
    return progresso;
  }

  /**
   * Exporta todo o histórico como string JSON para backup do estudante
   */
  public static exportarProgressoJSON(): string {
    const progresso = this.carregarProgresso();
    return JSON.stringify(progresso, null, 2);
  }

  /**
   * Importa o progresso a partir de uma string JSON
   */
  public static importarProgressoJSON(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.versaoSchema && parsed.licoesStatus) {
        this.salvarProgresso(parsed);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Erro na importação do JSON:', e);
      return false;
    }
  }

  /**
   * Limpa todo o histórico (com confirmação explícita do usuário na UI)
   */
  public static resetarProgresso(): void {
    removeStorageItem(STORAGE_KEY);
    memoryStorage = {};
  }
}
