export class RulesContractError extends Error {
  override readonly name: string = "RulesContractError";
}

export class RulesManifestError extends RulesContractError {
  override readonly name: string = "RulesManifestError";
}

export class RulesDigestError extends RulesContractError {
  override readonly name: string = "RulesDigestError";
}

export class RulesConflictError extends RulesContractError {
  override readonly name: string = "RulesConflictError";

  constructor(message: string, readonly observedMarkers: readonly string[]) {
    super(message);
  }
}
