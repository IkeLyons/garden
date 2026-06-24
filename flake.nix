{
  description = "Quartz digital garden";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        nodejs = pkgs.nodejs_22;
      in {
        devShells.default = pkgs.mkShell {
          packages = [ nodejs ];
          shellHook = ''
            echo "node $(node --version) / npm $(npm --version)"
          '';
        };
      }
    );
}
