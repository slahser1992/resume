import * as THREE from "three";
import {IUniform} from "three";

export interface VelocityUniform {
  [uniform: string]: IUniform;
}

export interface PositionUniform{
  [uniform: string]: IUniform;
}

export interface BirdsUniform {
  texturePosition: {
    value: any;
  };
  textureVelocity: {
    value: any;
  }
  color: {
    value: THREE.Color;
  },
  time: {
    value: number;
  },
  delta: {
    value: number;
  }
}
