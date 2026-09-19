# The Bonsai Collection

The Bonsai Collection (TBC) is an immersive digital gallery and virtual exhibition platform developed by ZkyStudios.

The project combines a 3D interactive environment with digital asset exhibition, collections, virtual spaces and, progressively, blockchain-based ownership and digital infrastructure.

TBC is designed as an exhibition and discovery layer. External marketplaces may be used for the purchase or sale of digital assets. TBC does not need to custody or directly process those external transactions.

---

## Vision

The goal of The Bonsai Collection is to build a scalable digital world where users can:

- Explore immersive 3D galleries.
- Discover digital collections.
- Visit themed rooms and exhibitions.
- Interact with virtual vitrines.
- View information about digital assets.
- Access external marketplaces when an asset is available for purchase.
- Eventually own, rent or manage virtual exhibition spaces.
- Participate in a future internal TBC economy.
- Interact with blockchain-based ownership and digital assets.

The project is designed to evolve progressively from a 3D virtual gallery into a larger digital ecosystem.

---

## Core Principles

### Privacy by Design

Privacy is a fundamental architectural principle of TBC.

The system is designed to minimize personal information collection and separate:

- Public identity
- Internal user identity
- Authentication
- Application data
- Financial records
- Blockchain data

Personal information should never be unnecessarily exposed publicly or stored directly on a public blockchain.

Where appropriate, TBC may use:

- Pseudonymous identifiers
- Random internal identifiers
- Hashes
- HMACs
- Encryption
- Access controls
- Data minimization

A hash is not considered equivalent to complete anonymity. The architecture must always distinguish between pseudonymization and actual anonymity.

---

## Security Principles

Security must be considered from the beginning of development rather than added after the platform is finished.

Future production infrastructure is expected to include:

- Secure authentication
- Multi-factor authentication
- Role-based access control
- Rate limiting
- Input validation
- Secure API design
- Secret management
- Encryption
- Security logging
- Monitoring
- Backups
- Disaster recovery
- Dependency security
- Vulnerability scanning
- External security testing

Sensitive information must never be committed to the repository.

Private keys, passwords, API secrets and financial credentials must never be stored in frontend code or public repositories.

---

## Blockchain Strategy

Blockchain is intended to be an infrastructure layer rather than the entire foundation of the application.

TBC follows a separation between:

```text
TBC Application
       |
       +--- Private Database
       |
       +--- Internal Ledger
       |
       +--- Blockchain