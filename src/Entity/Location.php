<?php

declare(strict_types=1);

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
    public ?int $id = null;

    #[Exclude]
    #[ORM\ManyToOne(inversedBy: 'locations')]
    #[ORM\JoinColumn(nullable: false)]
    public ?Device $device = null;

    #[ORM\ManyToOne]
    public ?SpeedLimit $speedLimit = null;

    #[Exclude]
    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    public ?DateTimeInterface $timestamp = null;

    #[Exclude]
    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    public ?DateTimeInterface $insertTimestamp = null;

    #[Exclude]
    #[ORM\Column(type: 'Point')]
    public ?Point $location = null;

    #[ORM\Column(nullable: true)]
    public ?int $accuracy = null;

    #[ORM\Column(nullable: true)]
    public ?int $speed = null;

    #[SerializedName('timestamp')]
    #[VirtualProperty]
    public function serializeTimestamp(): ?int
    {
        return $this->timestamp?->getTimestamp();
    }

    #[SerializedName('insert_timestamp')]
    #[VirtualProperty]
    public function serializeInsertTimestamp(): ?int
    {
        return $this->insertTimestamp?->getTimestamp();
    }

    #[SerializedName('location')]
    #[VirtualProperty]
    public function serializeLocation(): ?Point
    {
        if ($this->location) {
            return new Point($this->location->getX(), $this->location->getY());
        }
        return $location;
    }
}
