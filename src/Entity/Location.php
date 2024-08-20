<?php

namespace App\Entity;

use App\Repository\LocationRepository;
use DateTimeInterface;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation\Exclude;
use JMS\Serializer\Annotation\SerializedName;
use JMS\Serializer\Annotation\VirtualProperty;
use LongitudeOne\Spatial\PHP\Types\Geometry\Point;

#[ORM\Entity(repositoryClass: LocationRepository::class)]
class Location
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Exclude]
    #[ORM\ManyToOne(inversedBy: 'locations')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Device $device = null;

    #[ORM\ManyToOne]
    private ?SpeedLimit $speedLimit = null;

    #[Exclude]
    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?DateTimeInterface $timestamp = null;

    #[Exclude]
    #[ORM\Column(type: 'Point')]
    private ?Point $location = null;

    #[ORM\Column(nullable: true)]
    private ?int $accuracy = null;

    #[ORM\Column(nullable: true)]
    private ?int $speed = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDevice(): ?Device
    {
        return $this->device;
    }

    public function setDevice(?Device $device): static
    {
        $this->device = $device;

        return $this;
    }

    public function getSpeedLimit(): ?SpeedLimit
    {
        return $this->speedLimit;
    }

    public function setSpeedLimit(?SpeedLimit $speedLimit): static
    {
        $this->speedLimit = $speedLimit;

        return $this;
    }

    public function getTimestamp(): ?DateTimeInterface
    {
        return $this->timestamp;
    }

    public function setTimestamp(DateTimeInterface $timestamp): static
    {
        $this->timestamp = $timestamp;

        return $this;
    }

    #[SerializedName('timestamp')]
    #[VirtualProperty]
    public function serializeTimestamp(): ?int
    {
        return $this->getTimestamp()?->getTimestamp();
    }

    public function getLocation(): ?Point
    {
        return $this->location;
    }

    public function setLocation(Point $location): static
    {
        $this->location = $location;

        return $this;
    }

    #[SerializedName('location')]
    #[VirtualProperty]
    public function serializeLocation(): ?Point
    {
        $location = $this->getLocation();
        if ($location) {
            return new Point($location->getX(), $location->getY());
        }
        return $location;
    }

    public function getAccuracy(): ?int
    {
        return $this->accuracy;
    }

    public function setAccuracy(?int $accuracy): static
    {
        $this->accuracy = $accuracy;

        return $this;
    }

    public function getSpeed(): ?int
    {
        return $this->speed;
    }

    public function setSpeed(?int $speed): static
    {
        $this->speed = $speed;

        return $this;
    }
}
