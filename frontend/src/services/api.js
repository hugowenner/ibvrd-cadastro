// Dados mockados para simular um banco de dados
let mockData = [
    {
        id: 1,
        nomeCompleto: 'Ana Clara Silva',
        dataNascimento: '1985-05-15',
        telefone: '(11) 98765-4321',
        email: 'ana.silva@email.com',
        endereco: 'Rua das Flores, 123, São Paulo - SP',
        tipo: 'Membro',
        ministerio: 'Louvor',
        observacoes: 'Membro ativo.',
        dataCadastro: '2023-10-01'
    },
    {
        id: 2,
        nomeCompleto: 'Carlos Oliveira',
        dataNascimento: '1990-11-20',
        telefone: '(11) 91234-5678',
        email: 'carlos.oliveira@email.com',
        endereco: 'Avenida Principal, 456, São Paulo - SP',
        tipo: 'Visitante',
        ministerio: 'Nenhum',
        observacoes: 'Visitou pela primeira vez no culto de domingo.',
        dataCadastro: '2023-10-15'
    },
    {
        id: 3,
        nomeCompleto: 'Pastor Marcos Roberto',
        dataNascimento: '1970-03-08',
        telefone: '(11) 98888-7777',
        email: 'pastor.marcos@ibvrd.org.br',
        endereco: 'Rua da Igreja, 100, São Paulo - SP',
        tipo: 'Líder',
        ministerio: 'Presbitério',
        observacoes: 'Pastor titular.',
        dataCadastro: '2023-01-01'
    }
];

let nextId = 4;

// Simula um delay de rede
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Funções que simulam uma API REST
export const api = {
    getPessoas: async () => {
        await delay(500); // Simula latência de rede
        return Promise.resolve({ data: mockData });
    },

    addPessoa: async (pessoa) => {
        await delay(500);
        const novaPessoa = { ...pessoa, id: nextId++, dataCadastro: new Date().toISOString().split('T')[0] };
        mockData.push(novaPessoa);
        return Promise.resolve({ data: novaPessoa });
    },

    // Futuras funções para update e delete
    // updatePessoa: async (id, pessoa) => { ... },
    // deletePessoa: async (id) => { ... },
};