export interface Mensagem {
    id?: number,
    idChat: number,
    idUsuario?: number,
    nomeUsuario?: string,
    dataDeEnvio?: string,
    texto: string,
    origemMensagem?: 'USUARIO_ABERTURA' | 'IA' | 'SERVIDOR'
}