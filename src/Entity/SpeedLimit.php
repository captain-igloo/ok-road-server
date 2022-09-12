<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\SpeedLimitRepository;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation\Exclude;
use JMS\Serializer\Annotation\SerializedName;
use JMS\Serializer\Annotation\VirtualProperty;
use LongitudeOne\Spatial\PHP\Types\Geometry\Polygon;

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

    #[ORM\Column(type: 'Polygon')]
    #[Exclude]
    private ?Polygon $area = null;

    #[ORM\Column(type: 'Polygon')]
    #[SerializedName('area')]
    private ?Polygon $areaSimplified = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSpeedLimit(): ?int
    {
        return $this->speedLimit;
    }

    public function setSpeedLimit(int $speedLimit): self
    {
        $this->speedLimit = $speedLimit;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getArea(): ?Polygon
    {
        return $this->area;
    }

    public function setArea(Polygon $area): self
    {
        $this->area = $area;

        return $this;
    }

    public function getAreaSimplified(): ?Polygon
    {
        return $this->areaSimplified;
    }

    public function setAreaSimplified(Polygon $areaSimplified): self
    {
        $this->areaSimplified = $areaSimplified;

        return $this;
    }
}
