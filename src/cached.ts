import { Scope } from "./abstractions"
import {
  GenericTransformOp,
  GenericTransformOpScoped,
  IdentityTransformer,
  transform,
  UnaryTransformOp,
  UnaryTransformOpScoped,
} from "./transform"

export function cached(scope: Scope): GenericTransformOpScoped
export function cached(): GenericTransformOp

export function cached(f?: Scope): any {
  return transform(["cached", []], IdentityTransformer, f as Scope)
}
