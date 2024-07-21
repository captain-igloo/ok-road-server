<?php

namespace App\Entity;

use App\Repository\SpeedLimitRepository;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation\Exclude;
use LongitudeOne\Spatial\PHP\Types\Geometry\MultiPolygon;

#[ORM\Entity(repositoryClass: SpeedLimitRepository::class)]
class SpeedLimit
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $speedLimit = null;

    #[ORM\Column(length: 255)]
    private ?string $description = null;

    #[Exclude]
    #[ORM\Column(type: 'MultiPolygon')]
    private ?MultiPolygon $area = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSpeedLimit(): ?int
    {
        return $this->speedLimit;
    }

    public function setSpeedLimit(int $speedLimit): static
    {
        $this->speedLimit = $speedLimit;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getArea(): ?MultiPolygon
    {
        return $this->area;
    }

    public function setArea(MultiPolygon $area): static
    {
        $this->area = $area;

        return $this;
    }
}
