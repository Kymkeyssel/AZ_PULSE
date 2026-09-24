<?php

namespace App\Entity;

use App\Repository\ProjectRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ProjectRepository::class)]
#[ORM\Table(name: 'projects')]
class Project
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description = null;

    #[ORM\Column(length: 50)]
    private ?string $status = 'PENDING';

    #[ORM\Column(length: 50)]
    private ?string $priority = 'MEDIUM';

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $startDate = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $endDate = null;

    #[ORM\Column(nullable: true)]
    private ?float $budget = null;

    #[ORM\Column]
    private ?int $progress = 0;

    #[ORM\ManyToOne(inversedBy: 'projects')]
    private ?Customer $customer = null;

    #[ORM\OneToOne(inversedBy: 'project', cascade: ['persist', 'remove'])]
    private ?Opportunity $opportunity = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $manager = null;

    #[ORM\ManyToMany(targetEntity: User::class)]
    #[ORM\JoinTable(name: 'project_members')]
    private Collection $members;

    #[ORM\OneToMany(mappedBy: 'project', targetEntity: Task::class, cascade: ['persist', 'remove'])]
    private Collection $tasks;

    #[ORM\OneToMany(mappedBy: 'project', targetEntity: Milestone::class, cascade: ['persist', 'remove'])]
    private Collection $milestones;

    #[ORM\OneToMany(mappedBy: 'project', targetEntity: Deliverable::class, cascade: ['persist', 'remove'])]
    private Collection $deliverables;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $updatedAt = null;

    public function __construct()
    {
        $this->members = new ArrayCollection();
        $this->tasks = new ArrayCollection();
        $this->milestones = new ArrayCollection();
        $this->deliverables = new ArrayCollection();
        $this->createdAt = new \DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;
        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;
        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;
        return $this;
    }

    public function getPriority(): ?string
    {
        return $this->priority;
    }

    public function setPriority(string $priority): static
    {
        $this->priority = $priority;
        return $this;
    }

    public function getStartDate(): ?\DateTimeInterface
    {
        return $this->startDate;
    }

    public function setStartDate(?\DateTimeInterface $startDate): static
    {
        $this->startDate = $startDate;
        return $this;
    }

    public function getEndDate(): ?\DateTimeInterface
    {
        return $this->endDate;
    }

    public function setEndDate(?\DateTimeInterface $endDate): static
    {
        $this->endDate = $endDate;
        return $this;
    }

    public function getBudget(): ?float
    {
        return $this->budget;
    }

    public function setBudget(?float $budget): static
    {
        $this->budget = $budget;
        return $this;
    }

    public function getProgress(): ?int
    {
        return $this->progress;
    }

    public function setProgress(int $progress): static
    {
        $this->progress = $progress;
        return $this;
    }

    public function getCustomer(): ?Customer
    {
        return $this->customer;
    }

    public function setCustomer(?Customer $customer): static
    {
        $this->customer = $customer;
        return $this;
    }

    public function getOpportunity(): ?Opportunity
    {
        return $this->opportunity;
    }

    public function setOpportunity(?Opportunity $opportunity): static
    {
        $this->opportunity = $opportunity;
        return $this;
    }

    public function getManager(): ?User
    {
        return $this->manager;
    }

    public function setManager(?User $manager): static
    {
        $this->manager = $manager;
        return $this;
    }

    /**
     * @return Collection<int, User>
     */
    public function getMembers(): Collection
    {
        return $this->members;
    }

    public function addMember(User $member): static
    {
        if (!$this->members->contains($member)) {
            $this->members->add($member);
        }

        return $this;
    }

    public function removeMember(User $member): static
    {
        $this->members->removeElement($member);
        return $this;
    }

    /**
     * @return Collection<int, Task>
     */
    public function getTasks(): Collection
    {
        return $this->tasks;
    }

    public function addTask(Task $task): static
    {
        if (!$this->tasks->contains($task)) {
            $this->tasks->add($task);
            $task->setProject($this);
        }

        return $this;
    }

    public function removeTask(Task $task): static
    {
        if ($this->tasks->removeElement($task)) {
            // set the owning side to null (unless already changed)
            if ($task->getProject() === $this) {
                $task->setProject(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Milestone>
     */
    public function getMilestones(): Collection
    {
        return $this->milestones;
    }

    public function addMilestone(Milestone $milestone): static
    {
        if (!$this->milestones->contains($milestone)) {
            $this->milestones->add($milestone);
            $milestone->setProject($this);
        }

        return $this;
    }

    public function removeMilestone(Milestone $milestone): static
    {
        if ($this->milestones->removeElement($milestone)) {
            if ($milestone->getProject() === $this) {
                $milestone->setProject(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Deliverable>
     */
    public function getDeliverables(): Collection
    {
        return $this->deliverables;
    }

    public function addDeliverable(Deliverable $deliverable): static
    {
        if (!$this->deliverables->contains($deliverable)) {
            $this->deliverables->add($deliverable);
            $deliverable->setProject($this);
        }

        return $this;
    }

    public function removeDeliverable(Deliverable $deliverable): static
    {
        if ($this->deliverables->removeElement($deliverable)) {
            if ($deliverable->getProject() === $this) {
                $deliverable->setProject(null);
            }
        }

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTimeInterface $updatedAt): static
    {
        $this->updatedAt = $updatedAt;
        return $this;
    }
}
