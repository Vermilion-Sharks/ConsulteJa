import { ErrorTypeVS } from "@interfaces/errorInterfaces";

export abstract class ErroVS extends Error{
  abstract readonly status: number;
  readonly type: ErrorTypeVS;
  protected constructor(message: string, defaultType: ErrorTypeVS, customType?: ErrorTypeVS) {
    super(message);
    this.name = this.constructor.name;
    this.type = customType || defaultType
  }
}

class ErroDeValidacao extends ErroVS {
  readonly status = 400;
  constructor(message: string, type?: ErrorTypeVS){
    super(message, 'VS_VALIDATION', type)
  }
}

class ErroDeAutorizacao extends ErroVS {
  readonly status = 403;
  constructor(message: string, type?: ErrorTypeVS){
    super(message, 'VS_UNAUTHORIZED', type);
  }
}

class ErroDeNaoEncontrado extends ErroVS {
  readonly status = 404;
  constructor(message: string, type?: ErrorTypeVS){
    super(message, 'VS_NOT_FOUND', type)
  }
}

class ErroDeConflito extends ErroVS {
  readonly status = 409;
  constructor(message: string, type?: ErrorTypeVS){
    super(message, 'VS_CONFLICT', type)
  }
}

class ErroDeCredenciaisInvalidas extends ErroVS {
  readonly status = 401;
  constructor(message: string, type?: ErrorTypeVS){
    super(message, 'VS_INVALID', type)
  }
}

class ErroDeMuitasTentativas extends ErroVS {
  readonly status = 429;
  constructor(message: string, type?: ErrorTypeVS){
    super(message, 'VS_MANY_REQUESTS', type)
  }
}

class ErroDoServidor extends ErroVS {
  readonly status = 500;
  constructor(message: string, type?: ErrorTypeVS){
    super(message, 'VS_SERVER_ERROR', type)
  }
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