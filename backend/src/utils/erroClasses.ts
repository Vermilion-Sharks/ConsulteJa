class ErroDeValidacao extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ErroDeValidacao';
  }
}

class ErroDeAutorizacao extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ErroDeAutorizacao';
  }
}

class ErroDeNaoEncontrado extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ErroDeNaoEncontrado';
  }
}

class ErroDeConflito extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ErroDeConflito';
  }
}

class ErroDeCredenciaisInvalidas extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ErroDeCredenciaisInvalidas';
  }
}

class ErroDeMuitasTentativas extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ErroDeMuitasTentativas';
  }
}

export default {
  ErroDeValidacao,
  ErroDeAutorizacao,
  ErroDeNaoEncontrado,
  ErroDeConflito,
  ErroDeCredenciaisInvalidas,
  ErroDeMuitasTentativas
}