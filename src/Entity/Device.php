<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\DeviceRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation\Exclude;
use JMS\Serializer\Annotation\VirtualProperty;

#[ORM\Entity(repositoryClass: DeviceRepository::class)]
class Device
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    public ?int $id = null;

    #[Exclude]
    #[ORM\ManyToOne(inversedBy: 'devices')]
    #[ORM\JoinColumn(nullable: false)]
    public ?User $user = null;

    #[ORM\Column(length: 255)]
    public ?string $name = null;

    #[ORM\Column(length: 255)]
    public ?string $description = null;

    /**
     * @var Collection<int, Location>
     */
    #[Exclude]
    #[ORM\OneToMany(targetEntity: Location::class, mappedBy: 'device')]
    public Collection $locations;

    public function __construct()
    {
        $this->locations = new ArrayCollection();
    }

    #[VirtualProperty]
    public function getUsername(): ?string
    {
        return $this->user?->username;
    }

    public function addLocation(Location $location): static
    {
        if (!$this->locations->contains($location)) {
            $this->locations->add($location);
            $location->device = $this;
        }

        return $this;
    }

    public function removeLocation(Location $location): static
    {
        if ($this->locations->removeElement($location)) {
            // set the owning side to null (unless already changed)
            if ($location->device === $this) {
                $location->device = null;
            }
        }

        return $this;
    }
}
