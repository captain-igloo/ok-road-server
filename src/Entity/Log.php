<?php

namespace App\Entity;

use App\Repository\LogRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: LogRepository::class)]
class Log
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $insertDatetime = null;

    #[ORM\Column(type: 'Point')]
    private $location = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getInsertDatetime(): ?\DateTimeInterface
    {
        return $this->insertDatetime;
    }

    public function setInsertDatetime(\DateTimeInterface $insertDatetime): self
    {
        $this->insertDatetime = $insertDatetime;

        return $this;
    }

    public function getLocation()
    {
        return $this->location;
    }

    public function setLocation($location): self
    {
        $this->location = $location;

        return $this;
    }
}
