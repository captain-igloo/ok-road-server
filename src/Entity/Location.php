<?php
declare(strict_types=1);

namespace App\Entity;

use App\Repository\LocationRepository;
use DateTimeInterface;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation\Exclude;
use LongitudeOne\Spatial\PHP\Types\Geometry\Point;

#[ORM\Entity(repositoryClass: LocationRepository::class)]
class Location
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[ORM\ManyToOne(targetEntity: Device::class, inversedBy: 'locations')]
    #[ORM\JoinColumn(nullable: false)]
    #[Exclude]
    private $device;

    #[ORM\Column(type: 'float')]
    private $accuracy;

    #[ORM\Column(type: 'float')]
    private $speed;

    #[ORM\Column(type: 'datetime')]
    private $time;

    #[ORM\Column(type: 'point')]
    private $location;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDevice(): ?Device
    {
        return $this->device;
    }

    public function setDevice(?Device $device): self
    {
        $this->device = $device;

        return $this;
    }

    public function getAccuracy(): ?float
    {
        return $this->accuracy;
    }

    public function setAccuracy(float $accuracy): self
    {
        $this->accuracy = $accuracy;

        return $this;
    }

    public function getSpeed(): ?float
    {
        return $this->speed;
    }

    public function setSpeed(float $speed): self
    {
        $this->speed = $speed;

        return $this;
    }

    public function getTime(): ?DateTimeInterface
    {
        return $this->time;
    }

    public function setTime(DateTimeInterface $time): self
    {
        $this->time = $time;

        return $this;
    }

    public function getLocation(): ?Point
    {
        return $this->location;
    }

    public function setLocation(Point $location): self
    {
        $this->location = $location;

        return $this;
    }
}
