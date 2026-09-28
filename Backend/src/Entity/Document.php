<?php

namespace App\Entity;

use App\Repository\DocumentRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: DocumentRepository::class)]
#[ORM\Table(name: '`documents`')]
class Document
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description = null;

    #[ORM\Column(length: 255)]
    private ?string $originalName = null;

    #[ORM\Column(length: 100)]
    private ?string $mimeType = null;

    #[ORM\Column]
    private ?int $size = null;

    #[ORM\Column(length: 255)]
    private ?string $storagePath = null;

    #[ORM\Column(length: 50)]
    private ?string $type = 'GENERAL';

    #[ORM\Column(length: 50)]
    private ?string $status = 'DRAFT';

    #[ORM\ManyToOne(inversedBy: 'documents')]
    #[ORM\JoinColumn(nullable: true, onDelete: 'SET NULL')]
    private ?Category $category = null;

    #[ORM\ManyToOne(inversedBy: 'documents')]
    #[ORM\JoinColumn(nullable: true, onDelete: 'SET NULL')]
    private ?Folder $folder = null;

    #[ORM\Column(length: 50)]
    private ?string $currentVersion = '1.0';

    #[ORM\ManyToMany(targetEntity: Tag::class, inversedBy: 'documents')]
    private Collection $tags;

    #[ORM\OneToMany(mappedBy: 'document', targetEntity: DocumentVersion::class, cascade: ['persist', 'remove'])]
    private Collection $versions;

    #[ORM\OneToMany(mappedBy: 'document', targetEntity: DocumentFavorite::class, cascade: ['persist', 'remove'])]
    private Collection $favorites;

    #[ORM\ManyToOne(inversedBy: 'documents')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $owner = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $updatedAt = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $publishedAt = null;

    public function __construct()
    {
        $this->tags = new ArrayCollection();
        $this->versions = new ArrayCollection();
        $this->favorites = new ArrayCollection();
        $this->createdAt = new \DateTime();
    }

    public function getId(): ?int { return $this->id; }
    public function getTitle(): ?string { return $this->title; }
    public function setTitle(string $title): static { $this->title = $title; return $this; }
    public function getDescription(): ?string { return $this->description; }
    public function setDescription(?string $description): static { $this->description = $description; return $this; }
    public function getOriginalName(): ?string { return $this->originalName; }
    public function setOriginalName(string $originalName): static { $this->originalName = $originalName; return $this; }
    public function getMimeType(): ?string { return $this->mimeType; }
    public function setMimeType(string $mimeType): static { $this->mimeType = $mimeType; return $this; }
    public function getSize(): ?int { return $this->size; }
    public function setSize(int $size): static { $this->size = $size; return $this; }
    public function getStoragePath(): ?string { return $this->storagePath; }
    public function setStoragePath(string $storagePath): static { $this->storagePath = $storagePath; return $this; }
    public function getType(): ?string { return $this->type; }
    public function setType(string $type): static { $this->type = $type; return $this; }
    public function getStatus(): ?string { return $this->status; }
    public function setStatus(string $status): static { $this->status = $status; return $this; }
    public function getCategory(): ?Category { return $this->category; }
    public function setCategory(?Category $category): static { $this->category = $category; return $this; }
    public function getFolder(): ?Folder { return $this->folder; }
    public function setFolder(?Folder $folder): static { $this->folder = $folder; return $this; }
    public function getCurrentVersion(): ?string { return $this->currentVersion; }
    public function setCurrentVersion(string $currentVersion): static { $this->currentVersion = $currentVersion; return $this; }
    
    /** @return Collection<int, Tag> */
    public function getTags(): Collection { return $this->tags; }
    public function addTag(Tag $tag): static { if (!$this->tags->contains($tag)) { $this->tags->add($tag); } return $this; }
    public function removeTag(Tag $tag): static { $this->tags->removeElement($tag); return $this; }

    /** @return Collection<int, DocumentVersion> */
    public function getVersions(): Collection { return $this->versions; }
    public function addVersion(DocumentVersion $version): static { if (!$this->versions->contains($version)) { $this->versions->add($version); $version->setDocument($this); } return $this; }
    public function removeVersion(DocumentVersion $version): static { if ($this->versions->removeElement($version)) { if ($version->getDocument() === $this) { $version->setDocument(null); } } return $this; }

    /** @return Collection<int, DocumentFavorite> */
    public function getFavorites(): Collection { return $this->favorites; }
    public function addFavorite(DocumentFavorite $favorite): static { if (!$this->favorites->contains($favorite)) { $this->favorites->add($favorite); $favorite->setDocument($this); } return $this; }
    public function removeFavorite(DocumentFavorite $favorite): static { if ($this->favorites->removeElement($favorite)) { if ($favorite->getDocument() === $this) { $favorite->setDocument(null); } } return $this; }

    public function getOwner(): ?User { return $this->owner; }
    public function setOwner(?User $owner): static { $this->owner = $owner; return $this; }
    public function getCreatedAt(): ?\DateTimeInterface { return $this->createdAt; }
    public function setCreatedAt(\DateTimeInterface $createdAt): static { $this->createdAt = $createdAt; return $this; }
    public function getUpdatedAt(): ?\DateTimeInterface { return $this->updatedAt; }
    public function setUpdatedAt(?\DateTimeInterface $updatedAt): static { $this->updatedAt = $updatedAt; return $this; }
    public function getPublishedAt(): ?\DateTimeInterface { return $this->publishedAt; }
    public function setPublishedAt(?\DateTimeInterface $publishedAt): static { $this->publishedAt = $publishedAt; return $this; }
}
