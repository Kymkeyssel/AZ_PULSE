<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Uid\Uuid;
use Symfony\Bridge\Doctrine\Types\UuidType;

#[ORM\Entity]
#[ORM\Table(name: 'student_submissions')]
class StudentSubmission
{
    #[ORM\Id]
    #[ORM\Column(type: UuidType::NAME, unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.uuid_generator')]
    private ?Uuid $id = null;

    #[ORM\ManyToOne(targetEntity: Assignment::class)]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Assignment $assignment = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?User $student = null;

    #[ORM\Column(type: 'string', length: 50)]
    private string $status = 'PENDING'; // PENDING, SUBMITTED, GRADED, LATE

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private ?string $submissionUrl = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?\DateTimeInterface $submittedAt = null;

    public function getId(): ?Uuid { return $this->id; }

    public function getAssignment(): ?Assignment { return $this->assignment; }
    public function setAssignment(?Assignment $assignment): self { $this->assignment = $assignment; return $this; }

    public function getStudent(): ?User { return $this->student; }
    public function setStudent(?User $student): self { $this->student = $student; return $this; }

    public function getStatus(): string { return $this->status; }
    public function setStatus(string $status): self { $this->status = $status; return $this; }

    public function getSubmissionUrl(): ?string { return $this->submissionUrl; }
    public function setSubmissionUrl(?string $submissionUrl): self { $this->submissionUrl = $submissionUrl; return $this; }

    public function getSubmittedAt(): ?\DateTimeInterface { return $this->submittedAt; }
    public function setSubmittedAt(?\DateTimeInterface $submittedAt): self { $this->submittedAt = $submittedAt; return $this; }
}
