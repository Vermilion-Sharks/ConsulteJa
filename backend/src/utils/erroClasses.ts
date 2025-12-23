export abstract class ErroVS extends Error{
  abstract readonly status: number;
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

class ErroDeValidacao extends ErroVS {
  readonly status = 400;
}

class ErroDeAutorizacao extends ErroVS {
  readonly status = 403
}

class ErroDeNaoEncontrado extends ErroVS {
  readonly status = 404;
}

class ErroDeConflito extends ErroVS {
  readonly status = 409;
}

class ErroDeCredenciaisInvalidas extends ErroVS {
  readonly status = 401;
}

class ErroDeMuitasTentativas extends ErroVS {
  readonly status = 429;
}

class ErroDoServidor extends ErroVS {
  readonly status = 500;
}

export default {
  ErroDeValidacao,
  ErroDeAutorizacao,
  ErroDeNaoEncontrado,
  ErroDeConflito,
  ErroDeCredenciaisInvalidas,
  ErroDeMuitasTentativas,
  ErroDoServidor
}