export interface Mensagem {
    id?: string,
    idChat: number,
    idUsuario?: number,
    nomeUsuario?: string,
    dataDeEnvio?: string,
    texto: string,
    origemMensagem?: 'USUARIO_ABERTURA' | 'IA' | 'SERVIDOR'
}